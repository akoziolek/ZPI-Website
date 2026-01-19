import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    topic: { findUnique: vi.fn() },
    opinion: { create: vi.fn() }
  }
}));

vi.mock("../statusService.js", () => ({ findStatus: vi.fn() }));
vi.mock("../topicsService.js", () => ({ updateStatus: vi.fn() }));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { addOpinion } from "../opinionsService.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { STATUSES } from "../../config.js";
import { findStatus } from "../statusService.js";
import { updateStatus } from "../topicsService.js";

describe("opinionsService - addOpinion", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.opinion.create.mockReset();
    findStatus.mockReset();
    updateStatus.mockReset();
  });

  it("throws NotFoundError when topic missing", async () => {
    prismaMock.topic.findUnique.mockResolvedValue(null);
    await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ValidationError when topic status not SUBMITTED", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({ topic_id: 5, status: { status_name: STATUSES.OPEN } });
    await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(ValidationError);
  });

  it("creates opinion and updates status to APPROVED when isPositive true", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({ topic_id: 7, status: { status_name: STATUSES.SUBMITTED } });
    prismaMock.opinion.create.mockResolvedValue({});
    findStatus.mockResolvedValue({ status_id: 123 });

    await addOpinion("t-uuid", "good", true, 11);

    expect(prismaMock.opinion.create).toHaveBeenCalledWith({
      data: { argumentation: "good", employee_id: 11, topic_id: 7 }
    });
    expect(findStatus).toHaveBeenCalledWith(STATUSES.APPROVED);
    expect(updateStatus).toHaveBeenCalledWith("t-uuid", 123);
  });

  it("creates opinion and updates status to REJECTED when isPositive false", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({ topic_id: 8, status: { status_name: STATUSES.SUBMITTED } });
    prismaMock.opinion.create.mockResolvedValue({});
    findStatus.mockResolvedValue({ status_id: 321 });

    await addOpinion("t-uuid-2", "bad", false, 12);

    expect(prismaMock.opinion.create).toHaveBeenCalledWith({
      data: { argumentation: "bad", employee_id: 12, topic_id: 8 }
    });
    expect(findStatus).toHaveBeenCalledWith(STATUSES.REJECTED);
    expect(updateStatus).toHaveBeenCalledWith("t-uuid-2", 321);
  });
});
