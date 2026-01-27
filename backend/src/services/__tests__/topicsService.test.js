import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    topic: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() }
  }
}));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { getAllTopics, getTopicByUuid, mapTopicToDto, updateStatus } from "../topicsService.js";
import { NotFoundError } from "../../utils/errors.js";
import { STATUSES } from "../../config.js";

describe("topicsService", () => {
  beforeEach(() => {
    prismaMock.topic.findMany.mockReset();
    prismaMock.topic.findUnique.mockReset();
    prismaMock.topic.update.mockReset();
  });

  describe("mapTopicToDto", () => {
    it("maps complete topic with all fields", () => {
      const topic = {
        uuid: "t-1",
        name: "Topic 1",
        description: "Description",
        status: { status_name: STATUSES.OPEN },
        employee: {
          user: { uuid: "e-1", name: "Emp", surname: "E" },
          academic_title: { full_name: "Dr", shortcut: "Dr" }
        },
        students: [
          { user: { uuid: "s-1", name: "Stu", surname: "S" }, index: "2020" },
          { user: { uuid: "s-2", name: "Stu2", surname: "S2" }, index: "2021" }
        ],
        opinion: { argumentation: "ok", employee: { user: { uuid: "op-1", name: "Op", surname: "O" } } }
      };

      const dto = mapTopicToDto(topic);

      expect(dto.uuid).toBe("t-1");
      expect(dto.name).toBe("Topic 1");
      expect(dto.description).toBe("Description");
      expect(dto.status_name).toBe(STATUSES.OPEN);
      expect(dto.supervisor).toEqual({
        uuid: "e-1",
        name: "Emp",
        surname: "E",
        full_academic_title: "Dr",
        shortcut_academic_title: "Dr"
      });
      expect(dto.students).toHaveLength(2);
      expect(dto.students[0]).toEqual({ uuid: "s-1", index: "2020", name: "Stu", surname: "S" });
      expect(dto.students[1]).toEqual({ uuid: "s-2", index: "2021", name: "Stu2", surname: "S2" });
      expect(dto.opinion).toEqual({
        argumentation: "ok",
        author: { uuid: "op-1", name: "Op", surname: "O" }
      });
    });

    it("maps topic without supervisor", () => {
      const topic = {
        uuid: "t-2",
        name: "Topic 2",
        description: "Desc",
        status: { status_name: STATUSES.OPEN },
        employee: null,
        students: [],
        opinion: null
      };

      const dto = mapTopicToDto(topic);

      expect(dto.supervisor).toBeNull();
      expect(dto.opinion).toBeNull();
    });

    it("maps topic without opinion", () => {
      const topic = {
        uuid: "t-3",
        name: "Topic 3",
        description: "Desc",
        status: { status_name: STATUSES.SUBMITTED },
        employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: null },
        students: [],
        opinion: null
      };

      const dto = mapTopicToDto(topic);

      expect(dto.opinion).toBeNull();
      expect(dto.supervisor.full_academic_title).toBeUndefined();
      expect(dto.supervisor.shortcut_academic_title).toBeUndefined();
    });

    it("maps topic with empty students array", () => {
      const topic = {
        uuid: "t-4",
        name: "Topic 4",
        description: "Desc",
        status: { status_name: STATUSES.OPEN },
        employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: { full_name: "Dr", shortcut: "Dr" } },
        students: [],
        opinion: null
      };

      const dto = mapTopicToDto(topic);

      expect(dto.students).toEqual([]);
    });
  });

  describe("getAllTopics", () => {
    it("returns all topics without search filter", async () => {
      const topics = [
        {
          uuid: "t-1",
          name: "Topic 1",
          description: "Desc1",
          status: { status_name: STATUSES.OPEN },
          employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: { full_name: "Dr", shortcut: "Dr" } },
          students: [],
          opinion: null
        },
        {
          uuid: "t-2",
          name: "Topic 2",
          description: "Desc2",
          status: { status_name: STATUSES.SUBMITTED },
          employee: null,
          students: [],
          opinion: null
        }
      ];

      prismaMock.topic.findMany.mockResolvedValue(topics);

      const dtos = await getAllTopics();

      expect(dtos).toHaveLength(2);
      expect(dtos[0].name).toBe("Topic 1");
      expect(dtos[1].name).toBe("Topic 2");
      expect(prismaMock.topic.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          status: true,
          employee: { include: { user: true, academic_title: true } },
          students: { include: { user: true } }
        }
      });
    });

    it("returns topics with search filter applied", async () => {
      const topics = [
        {
          uuid: "t-1",
          name: "Machine Learning",
          description: "ML topic",
          status: { status_name: STATUSES.OPEN },
          employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: { full_name: "Dr", shortcut: "Dr" } },
          students: [],
          opinion: null
        }
      ];

      prismaMock.topic.findMany.mockResolvedValue(topics);

      const dtos = await getAllTopics("Machine");

      expect(dtos).toHaveLength(1);
      expect(prismaMock.topic.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "Machine", mode: "insensitive" }
        },
        include: {
          status: true,
          employee: { include: { user: true, academic_title: true } },
          students: { include: { user: true } }
        }
      });
    });

    it("returns empty array when no topics found", async () => {
      prismaMock.topic.findMany.mockResolvedValue([]);

      const dtos = await getAllTopics();

      expect(dtos).toEqual([]);
    });

    it("case-insensitive search works correctly", async () => {
      prismaMock.topic.findMany.mockResolvedValue([]);

      await getAllTopics("python");

      expect(prismaMock.topic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: "python", mode: "insensitive" } }
        })
      );
    });
  });

  describe("getTopicByUuid", () => {
    it("returns mapped DTO for existing topic", async () => {
      const topic = {
        uuid: "t-2",
        name: "Topic 2",
        description: "Desc",
        status: { status_name: STATUSES.OPEN },
        employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: { full_name: "Dr", shortcut: "Dr" } },
        students: [{ user: { uuid: "s-1", name: "Stu", surname: "S" }, index: "2020" }],
        opinion: { argumentation: "ok", employee: { user: { uuid: "op-1", name: "Op", surname: "O" } } }
      };

      prismaMock.topic.findUnique.mockResolvedValue(topic);

      const dto = await getTopicByUuid("t-2");

      expect(dto.uuid).toBe(topic.uuid);
      expect(dto.name).toBe(topic.name);
      expect(dto.supervisor).toBeDefined();
      expect(dto.opinion).toBeDefined();
      expect(prismaMock.topic.findUnique).toHaveBeenCalledWith({
        where: { uuid: "t-2" },
        include: {
          status: true,
          employee: { include: { user: true, academic_title: true } },
          students: { include: { user: true } },
          opinion: { include: { employee: { include: { user: true } } } }
        }
      });
    });

    it("returns topic with null supervisor and opinion", async () => {
      const topic = {
        uuid: "t-3",
        name: "Topic 3",
        description: "Desc",
        status: { status_name: STATUSES.OPEN },
        employee: null,
        students: [],
        opinion: null
      };

      prismaMock.topic.findUnique.mockResolvedValue(topic);

      const dto = await getTopicByUuid("t-3");

      expect(dto.supervisor).toBeNull();
      expect(dto.opinion).toBeNull();
    });

    it("throws NotFoundError when topic does not exist", async () => {
      prismaMock.topic.findUnique.mockResolvedValue(null);

      await expect(getTopicByUuid("nonexistent")).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError with correct error message", async () => {
      prismaMock.topic.findUnique.mockResolvedValue(null);

      await expect(getTopicByUuid("t-invalid")).rejects.toThrow("Topic");
    });
  });

});
