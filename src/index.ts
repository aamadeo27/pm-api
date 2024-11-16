import { startServer } from './server'

const PORT = process.env.PORT || 3000

async function init(){
  try {
    const app = await startServer()

    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`)
    })
  } catch(error){
    console.error('Failed to start. Error:', error)
  }
}


init()

