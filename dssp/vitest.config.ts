module.exports = {
  resolve: {
    alias: { "@": __dirname },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    maxWorkers: 2,
  },
} satisfies import("vitest/config").ViteUserConfig;
