import { AppRole } from '@prisma/client'
import { AccessControl } from 'accesscontrol'

const TEAM_QUERIES: string [] = []
const MANAGER_QUERIES: string [] = []

const TEAM_MUTATIONS: string [] = []
const MANAGER_MUTATIONS: string [] = []

const ac = new AccessControl()

ac.grant(AppRole.admin)
  .readAny()

;[...TEAM_QUERIES, ...TEAM_MUTATIONS].forEach((res) => {
  ac.grant(AppRole.team_member).read(res)
  ac.grant(AppRole.project_manager).read(res)
})

;[...MANAGER_QUERIES, ...MANAGER_MUTATIONS].forEach((res) => {
  ac.grant(AppRole.project_manager).read(res)
})

export default ac