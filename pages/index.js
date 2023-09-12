import Head from "next/head"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { signInWithGitHub, onAuthStateChanged, signOut } from "../firebase"
import { useRoomContext } from "../context/RoomContext"
import { useRouter } from "next/router"
import { AiFillGithub } from "react-icons/ai"

export default function Home() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [room, setRoom] = useState(null)
  const [user, setUser] = useState(null)
  const { createRoom, joinRoom } = useRoomContext()

  useEffect(() => {
    onAuthStateChanged((user) => {
      setUser(user)
      setAuthenticated(true)
    })
  }, [])

  const handleCreateRoom = () => {
    createRoom({ username: user.username })
      .then((roomId) => {
        toast.success("Connected")
        router.push("/room/[id]", `/room/${roomId}`)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleJoinRoom = (e) => {
    joinRoom({ username: user.username, roomId: room })
      .then((roomId) => {
        toast.success("Connected")
        router.push("/room/[id]", `/room/${roomId}`)
      })
      .catch((error) => {
        toast.error(error.message)
      })

    // handleJoinRoom({ username, roomId })
  }

  const handleSignOut = async () => {
    signOut().then(() => {
      toast.success("Successfully logged out")
      setUser(null)
      setAuthenticated(false)
    })
  }

  const handleSignInWithGitHub = async () => {
    signInWithGitHub()
      .then((user) => {
        // const { displayName, email, photoURL } = user;
        setUser(user)
        setAuthenticated(true)
        console.log({ user })
        toast.success(`Authenticated as ${user.email}`)
      })
      .catch(() => {
        setAuthenticated(false)
      })
  }

  return (
    <div>
      <Head>
        <title>Talki&Meet</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <header className="top-0 flex w-full justify-between items-center px-5 py-4 shadow">
          <div>
            <h1 className="font-bold text-3xl text-slate-700">Talki👾meet</h1>
          </div>

          <a className="flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 border border-slate-300 px-5 py-2 rounded-lg">
            <AiFillGithub size={26} />
            Repositorio
          </a>
        </header>

        <div className="w-full h-full px-20 my-20 py-5 m-0 mx-auto text-center grid grid-cols-2">
          <img src={"/img/hero.jpg"} layout="fill" />
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-bold text-4xl lg:text-6xl mb-5 text-left">
              Plataforma de videollamadas gratuitas y seguras.
            </h1>
            <p className="text-gray-700 mt-4 text-left">
              Con Meetwei podrás crear y unirte a reuniones, hablar con tus cercanos de manera
              fácil.
            </p>

            <div className="text-left w-full">
              {authenticated ? (
                <div className="flex items-center justify-between">
                  <div className="items-center flex">
                    <button
                      onClick={handleCreateRoom}
                      className="px-6 py-3  rounded-md bg-purple-900 text-zinc-100 text-sm font-medium"
                    >
                      Nueva reunión
                    </button>
                  </div>

                  <div className="flex-1 mx-5 items-center">
                    <input
                      value={room}
                      onInput={(e) => setRoom(e.target.value)}
                      className="my-6 border py-3 px-3 shadow rounded focus:outline-none font-mono font-normal w-1/2"
                      placeholder="Código de ejemplo: abc-mnps-xyx"
                    />
                    <button
                      type="submit"
                      onClick={handleJoinRoom}
                      className="px-6 py-3 mx-5 rounded-md bg-sky-500 text-zinc-100 text-sm font-medium"
                    >
                      Unirse
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignInWithGitHub}
                  className="px-6 py-3 mt-5 rounded-md bg-zinc-800 text-zinc-100 text-sm font-medium"
                >
                  Iniciar con GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Toaster />

      <footer></footer>
    </div>
  )
}
