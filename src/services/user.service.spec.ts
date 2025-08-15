import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { SupabaseService } from "./supabase.service";
import { User, UserStatus } from "../entities";
import { NotFoundException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockUser: User = global.testUtils.createTestUser();

  beforeEach(async () => {
    const mockSupabaseService = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      getClient: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    supabaseService = module.get(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const userData = { email: "test@example.com", status: UserStatus.ACTIVE };
      const expectedUser = { ...mockUser, ...userData };

      supabaseService.create.mockResolvedValue(expectedUser);

      const result = await service.createUser(userData);

      expect(result).toEqual(expectedUser);
      expect(supabaseService.create).toHaveBeenCalledWith("users", {
        ...userData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should handle creation errors", async () => {
      const userData = { email: "test@example.com" };
      const error = new Error("Database error");

      supabaseService.create.mockRejectedValue(error);

      await expect(service.createUser(userData)).rejects.toThrow(error);
    });
  });

  describe("findUserById", () => {
    it("should find a user by ID successfully", async () => {
      const userId = "test-user-001";
      supabaseService.findById.mockResolvedValue(mockUser);

      const result = await service.findUserById(userId);

      expect(result).toEqual(mockUser);
      expect(supabaseService.findById).toHaveBeenCalledWith("users", userId);
    });

    it("should throw NotFoundException when user not found", async () => {
      const userId = "non-existent-user";
      supabaseService.findById.mockResolvedValue(null);

      await expect(service.findUserById(userId)).rejects.toThrow(
        NotFoundException
      );
      expect(supabaseService.findById).toHaveBeenCalledWith("users", userId);
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email successfully", async () => {
      const email = "test@example.com";
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue(
            global.testUtils.createMockSupabaseResponse(mockUser)
          ),
      };

      supabaseService.getClient.mockReturnValue(mockSupabaseClient as any);

      const result = await service.findUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("users");
      expect(mockSupabaseClient.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith("email", email);
    });

    it("should return null when user not found", async () => {
      const email = "nonexistent@example.com";
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(
          global.testUtils.createMockSupabaseResponse(null, {
            code: "PGRST116",
          })
        ),
      };

      supabaseService.getClient.mockReturnValue(mockSupabaseClient as any);

      const result = await service.findUserByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const userId = "test-user-001";
      const updateData = { status: UserStatus.COMPLETED };
      const updatedUser = { ...mockUser, ...updateData };

      supabaseService.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(supabaseService.update).toHaveBeenCalledWith("users", userId, {
        ...updateData,
        updatedAt: expect.any(String),
      });
    });
  });

  describe("updateUserStatus", () => {
    it("should update user status successfully", async () => {
      const userId = "test-user-001";
      const newStatus = UserStatus.COMPLETED;
      const updatedUser = { ...mockUser, status: newStatus };

      supabaseService.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserStatus(userId, newStatus);

      expect(result).toEqual(updatedUser);
      expect(supabaseService.update).toHaveBeenCalledWith("users", userId, {
        status: newStatus,
        updatedAt: expect.any(String),
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const userId = "test-user-001";
      supabaseService.delete.mockResolvedValue(undefined);

      await service.deleteUser(userId);

      expect(supabaseService.delete).toHaveBeenCalledWith("users", userId);
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [mockUser];
      supabaseService.findAll.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
      expect(supabaseService.findAll).toHaveBeenCalledWith("users");
    });
  });

  describe("searchUsers", () => {
    it("should search users successfully", async () => {
      const query = "test";
      const users = [mockUser];
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        or: jest
          .fn()
          .mockResolvedValue(
            global.testUtils.createMockSupabaseResponse(users)
          ),
      };

      supabaseService.getClient.mockReturnValue(mockSupabaseClient as any);

      const result = await service.searchUsers(query);

      expect(result).toEqual(users);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("users");
      expect(mockSupabaseClient.select).toHaveBeenCalledWith("*");
      expect(mockSupabaseClient.or).toHaveBeenCalledWith(
        `email.ilike.%${query}%,id.ilike.%${query}%`
      );
    });

    it("should handle search errors", async () => {
      const query = "test";
      const error = new Error("Search failed");
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        or: jest
          .fn()
          .mockResolvedValue(
            global.testUtils.createMockSupabaseResponse(null, error)
          ),
      };

      supabaseService.getClient.mockReturnValue(mockSupabaseClient as any);

      await expect(service.searchUsers(query)).rejects.toThrow(error);
    });
  });
});
