import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service.js";
import { AccountsService } from "../../accounts/accounts.service.js";
import { PasswordService } from "../../../shared/services/password.service.js";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: PasswordService,
          useValue: {
            compare: vi.fn(),
            hash: vi.fn(),
            hashSync: vi.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
