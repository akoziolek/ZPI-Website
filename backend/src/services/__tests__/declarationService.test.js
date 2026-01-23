import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    signature: { create: vi.fn() },
    topic: { findUnique: vi.fn() }
  }
}));

vi.mock("../statusService.js", () => ({ findStatus: vi.fn() }));
vi.mock("../topicsService.js", () => ({ updateStatus: vi.fn() }));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { signDeclaration } from "../declarationService.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { STATUSES } from "../../config.js";
import { findStatus } from "../statusService.js";
import { updateStatus } from "../topicsService.js";

describe("declarationService - signDeclaration", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.signature.create.mockReset();
    findStatus.mockReset();
    updateStatus.mockReset();
  });

  it("throws NotFoundError when topic not found", async () => {
    prismaMock.topic.findUnique.mockResolvedValue(null);

    await expect(signDeclaration("uuid", 1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws NotFoundError when declaration not found", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: null
    });

    await expect(signDeclaration("uuid", 1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ValidationError when topic status is not PREPARING", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: { declaration_id: 2, signatures: [] },
      status: { status_name: STATUSES.OPEN }
    });

    await expect(signDeclaration("uuid", 1)).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError when student not assigned to the topic", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: { declaration_id: 2, signatures: [] },
      status: { status_name: STATUSES.PREPARING },
      students: [{ user_id: 99, name: "Test Student" }]
    });

    await expect(signDeclaration("uuid", 1)).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError when user already signed", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: { declaration_id: 2, signatures: [{ user_id: 5 }] },
      status: { status_name: STATUSES.PREPARING },
      students: [ { user_id: 5, name: "Test Student" } ]
    });

    await expect(signDeclaration("uuid", 5)).rejects.toBeInstanceOf(ValidationError);
    await expect(signDeclaration("uuid", 5)).rejects.toMatchObject({ message: "ALREADY_SIGNED" });
  });

  it("creates signature and does not update status when threshold not met", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: { declaration_id: 2, signatures: [{ user_id: 9 }, { user_id: 8 }] },
      status: { status_name: STATUSES.PREPARING },
      students: [ { user_id: 8, name: "Test Student 1" }, { user_id: 9, name: "Test Student 2" },
        { user_id: 7, name: "Test Student 3" }, { user_id: 6, name: "Test Student 4" }
       ]
    });

    prismaMock.signature.create.mockResolvedValue({});

    await signDeclaration("uuid", 7);

    expect(prismaMock.signature.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { user_id: 7 } },
        declaration: { connect: { declaration_id: 2 } }
      }
    });

    expect(findStatus).not.toHaveBeenCalled();
    expect(updateStatus).not.toHaveBeenCalled();
  });

  it("creates signature and updates status when threshold met", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 1,
      declaration: { declaration_id: 2, signatures: [{ user_id: 9 }, { user_id: 8 }] },
      status: { status_name: STATUSES.PREPARING },
      students: [ { user_id: 8, name: "Test Student 1" }, { user_id: 9, name: "Test Student 2" },
        { user_id: 7, name: "Test Student 3" }
       ]
    });

    prismaMock.signature.create.mockResolvedValue({});
    findStatus.mockResolvedValue({ status_id: 10 });

    await signDeclaration("topic-uuid", 7);

    expect(prismaMock.signature.create).toHaveBeenCalled();
    expect(findStatus).toHaveBeenCalledWith(STATUSES.SUBMITTED);
    expect(updateStatus).toHaveBeenCalledWith("topic-uuid", 10);
  });
});
