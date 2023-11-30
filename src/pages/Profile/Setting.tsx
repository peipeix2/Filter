import { useRef, useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import { storage } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../../firebase'
import { collectionGroup, query, where, setDoc, doc, getDocs, getDoc } from 'firebase/firestore'
import { auth } from '../../../firebase'
import { updateProfile } from 'firebase/auth'
import { useParams } from 'react-router-dom'

const Setting = () => {
  const { user } = useUserStore()
  const profileRef = useRef(null)
  const backdropRef = useRef(null)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [selectedBackdrop, setSelectedBackdrop] = useState(null)
  const { userId } = useParams()

  if (user.userId !== userId) {
    return <h1 className='text-center'>您不能瀏覽此頁</h1>
  }

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [])

  const fetchUser = async (userId: string) => {
    const docRef = doc(db, 'USERS', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setProfileUser(docSnap.data())
    }
  }

  const handleImageClick = () => {
    profileRef.current.click()
  }

  const handleBackdropClick = () => {
    backdropRef.current.click()
  }

  const handleImageChange = (event:any) => {
    const file = event.target.files[0]
    setSelectedProfile(file)

    handleUpload(file, user.userId)
  }

  const uploadImage = async (image: any) => {
    const imageRef = ref(storage, `/images/${image.name + uuidv4()}`)
    await uploadBytes(imageRef, image)

    const downloadURL = await getDownloadURL(imageRef)
    return downloadURL
  }

  const updateAvatarInCollection = async (collection:string, userIdField:string, userId:string, avatarURL:string) => {
    const q = query(collectionGroup(db, collection), where(userIdField, '==', userId))
    const querySnapshot = await getDocs(q)

    const updatePromises:any = []

    querySnapshot.forEach((doc) => {
      const docRef = doc.ref
      const updateAvatar = setDoc(docRef, { avatar: avatarURL }, { merge: true })
      updatePromises.push(updateAvatar)
    })
    
    await Promise.all(updatePromises)
  }

  const handleUpload = async (image: any, userId:string) => {
    const imageURL = await uploadImage(image)

    const currentUser: any = auth.currentUser
    await updateProfile(currentUser, {
      photoURL: imageURL,
    })

    const userRef = doc(db, 'USERS', userId)

    await setDoc(userRef, { avatar: imageURL }, { merge: true })
    await updateAvatarInCollection('COMMENTS', 'userId', userId, imageURL)
    await updateAvatarInCollection('REVIEWS', 'userId', userId, imageURL)
    await updateAvatarInCollection('FOLLOWER', 'userId', userId, imageURL)
    await updateAvatarInCollection('FOLLOWING', 'userId', userId, imageURL)
    console.log('updated complete')
    alert('頭像更新完成！')
  }

  const handleBackdropUpload = async (image:any, userId:string) => {
    const imageURL = await uploadImage(image)

    const userRef = doc(db, 'USERS', userId)
    await setDoc(userRef, { backdrop: imageURL }, { merge:true })
    alert('Cover Photo更新完成！')
  }

  const handleBackdropChange = (event:any) => {
    const file = event.target.files[0]
    setSelectedBackdrop(file)
    if (userId) {
      handleBackdropUpload(file, userId)
    }
  }

  if (!profileUser) return

  return (
    <Table aria-label="profile-table">
      <TableHeader>
        <TableColumn>欄位</TableColumn>
        <TableColumn>名稱</TableColumn>
        <TableColumn>修改</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="2">
          <TableCell>頭像</TableCell>
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
            <Button size="sm" onClick={handleImageClick}>
              修改
            </Button>
          </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Cover Photo</TableCell>
          <TableCell>
            <img src={profileUser.backdrop} className="w-20" />
          </TableCell>
          <TableCell>
            <input
              type="file"
              accept=".jpg, .png"
              ref={backdropRef}
              className="hidden"
              onChange={handleBackdropChange}
            />
            <Button size="sm" onClick={handleBackdropClick}>
              修改
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default Setting
