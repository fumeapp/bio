function setupConfig() {
  if (process.env.DEVRUN === 'true' && !process.env.CI)
    return { host: 'http://localhost:3000' }
  else
    return {}
}

export {
  setupConfig,
}
