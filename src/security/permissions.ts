import { AppRole } from '@prisma/client'
import { AccessControl } from 'accesscontrol'

const TEAM_QUERIES: string [] = ['current_user','users','user','project','projects','team','teams','task','tasks']
const MANAGER_QUERIES: string [] = []

const TEAM_MUTATIONS: string [] = ['update_user','update_task']
const MANAGER_MUTATIONS: string [] = ['update_team', 'create_task','delete_task','create_project','delete_project', 'update_project']

const ADMIN_ENDPOINTS: string [] = ['delete_user','create_team','delete_team']

const ac = new AccessControl()

;[...TEAM_QUERIES, ...TEAM_MUTATIONS].forEach((res) => {
  ac.grant(AppRole.team_member).read(res)
  ac.grant(AppRole.project_manager).read(res)
  ac.grant(AppRole.admin).read(res)
})

;[...MANAGER_QUERIES, ...MANAGER_MUTATIONS].forEach((res) => {
  ac.grant(AppRole.project_manager).read(res)
  ac.grant(AppRole.admin).read(res)
})

ADMIN_ENDPOINTS.forEach((res) => {
  ac.grant(AppRole.admin).read(res)
})



export default ac