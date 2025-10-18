import { PrismaClient } from "@/generated/prisma"
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended"

jest.mock("@/lib/prisma", () => ({
	__esModule: true,
	prisma: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
	mockReset(prismaMock)
})

export const prismaMock = jest.requireMock("@/lib/prisma").prisma as DeepMockProxy<PrismaClient>
