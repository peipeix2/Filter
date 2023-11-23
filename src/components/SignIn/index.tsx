import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useState } from 'react';
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
import SignUp from '../SignUp';

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <span onClick={onOpen} color="primary">
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
                  <span>沒有帳號？點擊註冊</span>
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