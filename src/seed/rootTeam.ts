import { hash } from "bcrypt"
import prisma from "../utils/prisma-client"
import { AppRole } from "@prisma/client"
import { create } from "domain"

const MEMBERS = ['Richard Hendricks', 'Bertram Gilfoyle', 'Dinesh', 'Jared Dunn', 'Jian Yang']
const AVATARS = ['https://avatars0.githubusercontent.com/u/58340587?v=4','https://avatars.githubusercontent.com/u/15678712?v=4',,'https://i.ytimg.com/vi/tdbYsEbHOSg/hqdefault.jpg',]
async function toUser(idx: number, name: string, team_id: number) {
  return {
    name,
    avatar_url: AVATARS[idx],
    email: `${name.toLowerCase().split(' ').join('.')}@piedpiper.com`,
    password: await hash('a', 11),
    team_id,
    active: true,
  }
}

export async function team() {
  const team = await prisma.team.create({
    data: {
      name: 'Root',
    }
  })

  const data = await Promise.all(MEMBERS.map((member,i) => toUser(i, member, team.id)))

  await prisma.user.createMany({ data })

  await prisma.user.update({ where: { email: 'jared.dunn@piedpiper.com' }, data: { role: AppRole.project_manager } })
  await prisma.user.update({ where: { email: 'bertram.gilfoyle@piedpiper.com' }, data: { role: AppRole.admin } })

  return team
}

export async function projects(team_id: number) {
  await prisma.project.createMany({
    data: [
      { name: 'Streaming Feature', team_id },
      { name: 'Social Media', team_id },
      { name: 'AI', team_id },
    ]
  })

  const projects = await prisma.project.findMany({ where: { team_id }, select: { id : true }})

  await Promise.all(projects.map((p) => prisma.task.createMany({ 
    data: [
      { name: 'task 1', description: 'desc', project_id: p.id, completed_at: Math.random() < 50 ? new Date() : undefined },
      { name: 'task 2', description: 'desc', project_id: p.id, completed_at: Math.random() < 50 ? new Date() : undefined },
      { name: 'task 3', description: 'desc', project_id: p.id, completed_at: Math.random() < 50 ? new Date() : undefined },
      { name: 'task 4', description: 'desc', project_id: p.id, completed_at: Math.random() < 50 ? new Date() : undefined },
    ]
  })))

}