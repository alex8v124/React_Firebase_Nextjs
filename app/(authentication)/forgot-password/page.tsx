'use client'

import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "react-hot-toast"

const userSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type UserData = z.infer<typeof userSchema>

export default function UserComponent() {
  const [users, setUsers] = useState<(UserData & { id: string })[]>([])
  const [editingUser, setEditingUser] = useState<(UserData & { id: string }) | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"))
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (UserData & { id: string })[]
      setUsers(fetchedUsers)
    } catch (error) {
      toast.error("Error al obtener usuarios.")
      console.error("Error fetching users:", error)
    }
  }

  const onSubmit = async (data: UserData) => {
    try {
      if (editingUser) {
        const userDocRef = doc(db, "usuarios", editingUser.id)
        await updateDoc(userDocRef, data)
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? { ...user, ...data } : user
          )
        )
        toast.success("Usuario actualizado correctamente.")
      } else {
        const newDocRef = await addDoc(collection(db, "usuarios"), data)
        setUsers((prevUsers) => [
          ...prevUsers,
          { id: newDocRef.id, ...data },
        ])
        toast.success("Usuario agregado correctamente.")
      }
      handleCloseModal()
    } catch (error) {
      toast.error("Error al guardar el usuario.")
      console.error("Error saving user:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id))
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      toast.success("Usuario eliminado correctamente.")
    } catch (error) {
      toast.error("Error al eliminar el usuario.")
      console.error("Error deleting user:", error)
    }
  }

  const handleEdit = (user: UserData & { id: string }) => {
    setEditingUser(user)
    Object.entries(user).forEach(([key, value]) => {
      setValue(key as keyof UserData, value)
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    reset()
  }

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>Agregar Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register("nombre")} placeholder="Nombre" />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              <Input {...register("apellido")} placeholder="Apellido" />
              {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido.message}</p>}
              <Input {...register("email")} placeholder="Email" type="email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <Input {...register("password")} placeholder="Password" type="password" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUser ? "Actualizar" : "Agregar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.apellido}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(user)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}