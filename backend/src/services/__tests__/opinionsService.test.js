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

  describe("Input Validation", () => {
    it("throws NotFoundError when topic missing", async () => {
      prismaMock.topic.findUnique.mockResolvedValue(null);
      await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError with correct message", async () => {
      prismaMock.topic.findUnique.mockResolvedValue(null);
      await expect(addOpinion("nonexistent", "arg", true, 1)).rejects.toThrow("Topic not found");
    });

    it("throws ValidationError when topic status is OPEN", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 5,
        status: { status_name: STATUSES.OPEN }
      });
      await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when topic status is APPROVED", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 5,
        status: { status_name: STATUSES.APPROVED }
      });
      await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when topic status is REJECTED", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 5,
        status: { status_name: STATUSES.REJECTED }
      });
      await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when topic status is PREPARING", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 5,
        status: { status_name: STATUSES.PREPARING }
      });
      await expect(addOpinion("t", "arg", true, 1)).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError with correct message", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 5,
        status: { status_name: STATUSES.OPEN }
      });
      await expect(addOpinion("t", "arg", true, 1)).rejects.toThrow("Topic must be in 'Złożony' status to add an opinion");
    });
  });

  describe("Positive Opinion", () => {
    it("creates opinion and updates status to APPROVED when isPositive true", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion("t-uuid", "good", true, 11);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith({
        data: { argumentation: "good", employee_id: 11, topic_id: 7 }
      });
      expect(findStatus).toHaveBeenCalledWith(STATUSES.APPROVED);
      expect(updateStatus).toHaveBeenCalledWith("t-uuid", 123);
    });

    it("creates opinion with positive boolean value", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion("t-1", "positive feedback", true, 5);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ argumentation: "positive feedback", employee_id: 5 })
        })
      );
      expect(findStatus).toHaveBeenCalledWith(STATUSES.APPROVED);
    });

    it("handles empty argumentation for positive opinion", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion("t-uuid", "", true, 11);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith({
        data: { argumentation: "", employee_id: 11, topic_id: 7 }
      });
      expect(findStatus).toHaveBeenCalledWith(STATUSES.APPROVED);
    });

    it("handles long argumentation for positive opinion", async () => {
      const longArgumentation = "a".repeat(1000);
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion("t-uuid", longArgumentation, true, 11);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith({
        data: { argumentation: longArgumentation, employee_id: 11, topic_id: 7 }
      });
    });
  });

  describe("Negative Opinion", () => {
    it("creates opinion and updates status to REJECTED when isPositive false", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 8,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 321 });

      await addOpinion("t-uuid-2", "bad", false, 12);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith({
        data: { argumentation: "bad", employee_id: 12, topic_id: 8 }
      });
      expect(findStatus).toHaveBeenCalledWith(STATUSES.REJECTED);
      expect(updateStatus).toHaveBeenCalledWith("t-uuid-2", 321);
    });

    it("creates opinion with negative boolean value", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 8,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 321 });

      await addOpinion("t-2", "negative feedback", false, 6);

      expect(prismaMock.opinion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ argumentation: "negative feedback", employee_id: 6 })
        })
      );
      expect(findStatus).toHaveBeenCalledWith(STATUSES.REJECTED);
    });

    it("treats falsy values as negative opinion", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 8,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 321 });

      await addOpinion("t-uuid", "not good", 0, 12);

      expect(findStatus).toHaveBeenCalledWith(STATUSES.REJECTED);
    });
  });

  describe("Status Update Handling", () => {
    it("skips status update when findStatus returns null", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue(null);

      await addOpinion("t-uuid", "good", true, 11);

      expect(prismaMock.opinion.create).toHaveBeenCalled();
      expect(updateStatus).not.toHaveBeenCalled();
    });

    it("updates status with correct status_id", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 999 });

      await addOpinion("t-uuid", "good", true, 11);

      expect(updateStatus).toHaveBeenCalledWith("t-uuid", 999);
    });

    it("calls updateStatus with topic UUID", async () => {
      const topicUuid = "specific-uuid-123";
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion(topicUuid, "good", true, 11);

      expect(updateStatus).toHaveBeenCalledWith(topicUuid, expect.any(Number));
    });
  });

  describe("Topic Lookup", () => {
    it("queries topic with correct UUID", async () => {
      const topicUuid = "t-lookup-123";
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion(topicUuid, "good", true, 11);

      expect(prismaMock.topic.findUnique).toHaveBeenCalledWith({
        where: { uuid: topicUuid },
        include: { status: true }
      });
    });

    it("includes status in topic query", async () => {
      prismaMock.topic.findUnique.mockResolvedValue({
        topic_id: 7,
        status: { status_name: STATUSES.SUBMITTED }
      });
      prismaMock.opinion.create.mockResolvedValue({});
      findStatus.mockResolvedValue({ status_id: 123 });

      await addOpinion("t-uuid", "good", true, 11);

      expect(prismaMock.topic.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { status: true }
        })
      );
    });
  });
});
