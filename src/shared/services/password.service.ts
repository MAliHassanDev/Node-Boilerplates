import { Injectable, Logger } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;
  private readonly logger = new Logger(PasswordService.name);

  public async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error: unknown) {
      this.logger.error("Failed to hash password", error);
      throw error;
    }
  }

  public hashSync(password: string) {
    try {
      return bcrypt.hashSync(password, this.saltRounds);
    } catch (error: unknown) {
      this.logger.error("Failed to hash password", error);
      throw error;
    }
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error: unknown) {
      this.logger.error("Failed to compare password", error);
      throw error;
    }
  }

  public generateRandomPassword(length = 8) {
    const upperCaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseCharacters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "@$!%*?&#+";

    const allCharacters =
      upperCaseCharacters + lowerCaseCharacters + numbers + specialCharacters;

    // Ensure we have at least one character from each required set
    const requiredChars = [
      upperCaseCharacters.charAt(
        Math.floor(Math.random() * upperCaseCharacters.length),
      ),
      lowerCaseCharacters.charAt(
        Math.floor(Math.random() * lowerCaseCharacters.length),
      ),
      numbers.charAt(Math.floor(Math.random() * numbers.length)),
      specialCharacters.charAt(
        Math.floor(Math.random() * specialCharacters.length),
      ),
    ];

    // Generate remaining characters randomly from all sets
    const remainingLength = Math.max(0, length - requiredChars.length);
    const remainingChars = Array(remainingLength)
      .fill(0)
      .map(() =>
        allCharacters.charAt(Math.floor(Math.random() * allCharacters.length)),
      );

    // Combine and shuffle all characters to avoid predictable patterns
    const allChars = [...requiredChars, ...remainingChars];
    for (let i = allChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [allChars[i], allChars[j]] = [allChars[j]!, allChars[i]!]; // Swap elements (Fisher-Yates shuffle)
    }

    return allChars.join("");
  }
}
