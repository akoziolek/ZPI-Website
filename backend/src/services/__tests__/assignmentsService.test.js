import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    student: { update: vi.fn() },
    topic: { findUnique: vi.fn() }
  }
}));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { joinTopic, withdrawTopic } from "../assignmentsService.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { STATUSES, MAX_TOPIC_CAPACITY } from "../../config.js";

describe("assignmentsService - joinTopic", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.student.update.mockReset();
  });

  it("throws NotFoundError when topic not found", async () => {
    prismaMock.topic.findUnique.mockResolvedValue(null);

    await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ValidationError when topic status is not OPEN", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 10,
      status: { status_name: STATUSES.REJECTED },
      _count: { students: 0 }
    });

    await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws STUDENTS_LIMIT_REACHED when capacity reached", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 10,
      status: { status_name: STATUSES.OPEN },
      _count: { students: MAX_TOPIC_CAPACITY }
    });

    await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
    await expect(joinTopic("some-uuid", 1)).rejects.toMatchObject({ message: "STUDENTS_LIMIT_REACHED" });
  });

  it("calls student.update to connect topic on success", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 10,
      status: { status_name: STATUSES.OPEN },
      _count: { students: 2 }
    });

    prismaMock.student.update.mockResolvedValue({});

    await joinTopic("some-uuid", 42);

    expect(prismaMock.student.update).toHaveBeenCalledWith({
      where: { user_id: 42 },
      data: { topic: { connect: { topic_id: 10 } } }
    });
  });
});

describe("assignmentsService - withdrawTopic", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.student.update.mockReset();
  });

  it("throws NotFoundError when topic not found", async () => {
    prismaMock.topic.findUnique.mockResolvedValue(null);

    await expect(withdrawTopic("some-uuid", 1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ValidationError when topic status is not OPEN", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 10,
      status: { status_name: STATUSES.REJECTED }
    });

    await expect(withdrawTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
  });

  it("calls student.update to disconnect topic on success", async () => {
    prismaMock.topic.findUnique.mockResolvedValue({
      topic_id: 10,
      status: { status_name: STATUSES.OPEN },
      students: [{ user_id: 99, name: "Test Student" }]
    });

    prismaMock.student.update.mockResolvedValue({});

    await withdrawTopic("some-uuid", 99);

    expect(prismaMock.student.update).toHaveBeenCalledWith({
      where: { user_id: 99 },
      data: { topic: { disconnect: true } }
    });
  });
});
