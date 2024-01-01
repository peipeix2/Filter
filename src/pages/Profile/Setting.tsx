import { useRef, useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import { db } from '../../../firebase'
import {
  collectionGroup,
  query,
  where,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { auth } from '../../../firebase'
import { updateProfile } from 'firebase/auth'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserProfileState } from '../../utils/type'
import { User } from 'firebase/auth'
import firestore from '../../utils/firestore'

const Setting = () => {
  const { user } = useUserStore()
  const profileRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLInputElement>(null)
  const [profileUser, setProfileUser] = useState<UserProfileState | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<File | null>(null)
  const [selectedBackdrop, setSelectedBackdrop] = useState<File | null>(null)
  const { userId } = useParams()

  const isCurrentUser = user.userId === userId
  if (!isCurrentUser) {
    return <h1 className="text-center">您不能瀏覽此頁</h1>
  }

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [])

  const fetchUser = async (userId: string) => {
    const docSnap = await firestore.getDoc('USERS', userId)
    if (docSnap) {
      setProfileUser(docSnap as UserProfileState)
    }
  }

  const handleClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      setSelectedProfile(file)

      handleAvatarUpload(file, user.userId)
    }
  }

  const updateAvatarInCollection = async (
    collection: string,
    userIdField: string,
    userId: string,
    avatarURL: string
  ) => {
    const q = query(
      collectionGroup(db, collection),
      where(userIdField, '==', userId)
    )
    const querySnapshot = await getDocs(q)

    const updatePromises: any = []

    querySnapshot.forEach((doc) => {
      const docRef = doc.ref
      const updateAvatar = setDoc(
        docRef,
        { avatar: avatarURL },
        { merge: true }
      )
      updatePromises.push(updateAvatar)
    })

    await Promise.all(updatePromises)
  }

  const handleAvatarUpload = async (image: File, userId: string) => {
    const imageURL = await firestore.uploadImage(image)

    const currentUser: User | null = auth.currentUser
    if (currentUser) {
      await updateProfile(currentUser, {
        photoURL: imageURL,
      })
    }

    await firestore.setDoc('USERS', userId, { avatar: imageURL })
    await updateAvatarInCollection('COMMENTS', 'userId', userId, imageURL)
    await updateAvatarInCollection('REVIEWS', 'userId', userId, imageURL)
    await updateAvatarInCollection('FOLLOWER', 'userId', userId, imageURL)
    await updateAvatarInCollection('FOLLOWING', 'userId', userId, imageURL)
    toast.success('頭像更新完成！')
  }

  const handleBackdropUpload = async (image: File, userId: string) => {
    const imageURL = await firestore.uploadImage(image)
    await firestore.setDoc('USERS', userId, { backdrop: imageURL })
    toast.success('Cover Photo更新完成！')
  }

  const handleBackdropChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      setSelectedBackdrop(file)
      handleBackdropUpload(file, userId)
    }
  }

  if (!profileUser) return

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <Table aria-label="profile-table">
        <TableHeader>
          <TableColumn>欄位</TableColumn>
          <TableColumn>使用圖片</TableColumn>
          <TableColumn>修改</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="2">
            <TableCell className="text-sm text-[#475565]">頭像</TableCell>
            <TableCell>
              {selectedProfile ? (
                <img
                  src={URL.createObjectURL(selectedProfile)}
                  className="w-20"
                  alt="updated-avatar"
                />
              ) : (
                <img src={user.avatar} className="w-20" alt="current-avatar" />
              )}
            </TableCell>
            <TableCell>
              <input
                type="file"
                accept=".jpg, .png"
                ref={profileRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <Button size="sm" onClick={() => handleClick(profileRef)}>
                修改
              </Button>
            </TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell className="text-sm text-[#475565]">
              Cover Photo
            </TableCell>
            <TableCell>
              {selectedBackdrop ? (
                <img
                  src={URL.createObjectURL(selectedBackdrop)}
                  className="w-20"
                />
              ) : (
                <img src={profileUser.backdrop} className="w-20" />
              )}
            </TableCell>
            <TableCell>
              <input
                type="file"
                accept=".jpg, .png"
                ref={backdropRef}
                className="hidden"
                onChange={handleBackdropChange}
              />
              <Button size="sm" onClick={() => handleClick(backdropRef)}>
                修改
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default Setting
