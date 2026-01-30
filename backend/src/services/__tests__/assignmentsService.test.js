import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    student: { update: vi.fn(), findUnique: vi.fn() },
    topic: { findUnique: vi.fn() }
  }
}));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { joinTopic, withdrawTopic } from "../assignmentsService.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { STATUSES } from "../../config.js";

describe("assignmentsService - joinTopic", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.student.update.mockReset();
  });

  describe("Input Validation", () => {
    it("throws NotFoundError when topic not found", async () => {
      prismaMock.topic.findUnique.mockResolvedValue(null);

      await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when topic status is not OPEN", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.REJECTED },
        students: []
      });

      await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when student is already assigned to a topic", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: []
      });

      prismaMock.student.findUnique.mockResolvedValue({
        user_id: 1, 
        name: "Test Student",
        topic_id: 2,
      })

      await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
      expect(prismaMock.student.findUnique).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });

    it("throws STUDENTS_LIMIT_REACHED when capacity reached", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: [{ user_id: 91, name: "Test Student 1" }, { user_id: 92, name: "Test Student 2" }, 
          { user_id: 93, name: "Test Student 3" }, { user_id: 94, name: "Test Student 4" }, { user_id: 95, name: "Test Student 5" }
        ]
      });

      prismaMock.student.findUnique.mockResolvedValue({
        user_id: 1, 
        name: "Test Student",
        topic_id: null,
      })

      await expect(joinTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
      await expect(joinTopic("some-uuid", 1)).rejects.toMatchObject({ message: "STUDENTS_LIMIT_REACHED" });
    });
  });

  describe("Behavior & Queries", () => {
    it("calls student.update to connect topic on success", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: [{ user_id: 91, name: "Test Student 1" }, { user_id: 92, name: "Test Student 2" } ]
      });

      prismaMock.student.findUnique.mockResolvedValue({
        user_id: 42, 
        name: "Test Student",
        topic_id: null,
      })

      prismaMock.student.update.mockResolvedValue({});

      await joinTopic("some-uuid", 42);

      expect(prismaMock.student.update).toHaveBeenCalledWith({
        where: { user_id: 42 },
        data: { topic: { connect: { topic_id: 10 } } }
      });
    });

    it("queries topic with correct UUID and includes status and students", async () => {
      const topicUuid = "topic-lookup-1";
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: []
      });

      prismaMock.student.findUnique.mockResolvedValue({ user_id: 42, topic_id: null });
      prismaMock.student.update.mockResolvedValue({});

      await joinTopic(topicUuid, 42);

      expect(prismaMock.topic.findUnique).toHaveBeenCalledWith({
        where: { uuid: topicUuid },
        include: { status: true, students: true }
      });
    });
  });
});

describe("assignmentsService - withdrawTopic", () => {
  beforeEach(() => {
    prismaMock.topic.findUnique.mockReset();
    prismaMock.student.update.mockReset();
  });

  describe("Input Validation", () => {
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

    it("throws ValidationError when student not assigned to the topic", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: [{ user_id: 99, name: "Test Student" }]
      });

      await expect(withdrawTopic("some-uuid", 1)).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("Behavior & Queries", () => {
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

    it("queries topic with correct UUID and includes status and students for withdraw", async () => {
      const topicUuid = "topic-withdraw-1";
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 10,
        status: { status_name: STATUSES.OPEN },
        students: [{ user_id: 99 }]
      });

      prismaMock.student.update.mockResolvedValue({});

      await withdrawTopic(topicUuid, 99);

      expect(prismaMock.topic.findUnique).toHaveBeenCalledWith({
        where: { uuid: topicUuid },
        include: { status: true, students: true }
      });
    });
  });
});
