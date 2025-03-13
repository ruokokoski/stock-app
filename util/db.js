const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

//const isTestEnv = process.env.NODE_ENV === 'test'

const sequelize = new Sequelize(
  process.env.DB_DIALECT === 'sqlite'
    ? {
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || ':memory:',
      logging: false, // Disable logging for CI
    }
    : DATABASE_URL,
  {
    dialect: process.env.DB_DIALECT || 'postgres',
    //logging: false,
  }
)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (error) {
    console.log('failed to connect to the database: ', error)
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}
  
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }