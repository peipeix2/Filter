import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore'
import { db } from "../../../firebase";
import useUserStore from "../../store/userStore";

const SignUp = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const setUser = useUserStore((state) => state.setUser)

  const DEFAULT_PROFILE =
    'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/default-profile-pic-e1513291410505.jpeg?alt=media&token=cacce2e3-5b21-4b89-96c2-d94003b3063d'

  const handleSignUp = async() => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      const currentUser:any = auth.currentUser
      await updateProfile(currentUser, {
        displayName: userName,
        photoURL:
          DEFAULT_PROFILE,
      })
      console.log(currentUser)
      if (currentUser) {
        const userData = {
          userId: currentUser?.uid,
          username: userName,
          email: currentUser?.email,
          avatar: DEFAULT_PROFILE,
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser({
          userId: currentUser?.uid,
          username: userName,
          email: currentUser?.email,
          avatar: DEFAULT_PROFILE
        })
        postUserInfo(currentUser?.uid, currentUser.email)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const postUserInfo = async (id:string | undefined, email:string | null) => {
    try {
      await setDoc(doc(db, "USERS", `${id}`), {
        userId: id,
        username: userName,
        email: email,
        avatar: DEFAULT_PROFILE,
        followers_count: 0,
        follows_count: 0
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <span onClick={onOpen} color="primary">
        Sign Up
      </span>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="py-10"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-slate-600">
                註冊帳號
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="用戶名稱"
                  variant="bordered"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  autoFocus
                  label="Email"
                  variant="bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="密碼"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="default" onPress={onClose} className="bg-slate-600 text-white" onClick={handleSignUp}>
                  Sign up
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignUp