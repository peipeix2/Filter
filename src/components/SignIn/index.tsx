import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase'
import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react'
import SignUp from '../SignUp'
import toast from 'react-hot-toast'

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('登入成功')
    } catch (error) {
      toast.error('登入失敗，帳號密碼錯誤')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <>
      <span
        onClick={onOpen}
        color="primary"
        className="cursor-pointer hover:text-gray-500"
      >
        Sign In
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
              <ModalHeader className="flex flex-col gap-1">登入</ModalHeader>
              <ModalBody>
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
                <div>
                  <span className="mr-2">沒有帳號？點擊註冊</span>
                  <SignUp />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="default"
                  onPress={onClose}
                  className="bg-slate-600 text-white"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignIn
