module.exports = {
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: { "@": __dirname },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
    maxWorkers: 2,
  },
} satisfies import("vitest/config").ViteUserConfig;
