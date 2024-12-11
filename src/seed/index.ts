import { team, projects } from "./rootTeam"

async function main(){
  const t = await team()
  await projects(t.id)
}

main()
