import React from 'react';
import { useTranslation } from 'adminjs'
import { CurrentUserNav, Box, Link, Modal } from '@adminjs/design-system'
import { io } from "socket.io-client"

const LoggedIn = (props) => {
    
    const { session, paths } = props
    const { translateButton } = useTranslation()
    const [showModal, setShowModal] = React.useState(false)
    const [newMsg, setNewMsg] = React.useState(false)
    
    const lineActionsNormal = [{
        icon: 'Notification',
        label: 'Notification',
        href: '/admin/resources/Message',
        onClick: (event) => {
          setNewMsg(false)
        }
    }]
    const lineActionsFilled = [{
      icon: 'NotificationFilled',
      label: 'Notification',
      href: '/admin/resources/Message',
      onClick: (event) => {
        setNewMsg(false)
      }
    }]
  
    const dropActions = [{
      label: translateButton('logout'),
      onClick: (event) => {
        event.preventDefault()
        window.location.href = paths.logoutPath
      },
      icon: 'Logout',
    }, {
      label: translateButton('myProfile'),
      onClick: (event) => {
        // navigate to your "My Profile" page
      },
      icon: 'User',
    }]

    React.useEffect(() => {
      const socket = io({
        extraHeaders: {
          group: session.role
        }
      })
      socket.on('System', (msg) => {
          setNewMsg(true)
          setShowModal(true)
      })  
    },[])
    
    return (
    <>
      { showModal &&
        <Modal
          title="System Message"
          onOverlayClick={()=> setShowModal(false)}
          variant='info'
          subTitle='You have new notifications'
          buttons={[
            {
              label: 'Go check',
              onClick: () => {
                setNewMsg(false)
                setShowModal(false)
                window.location.href = '/admin/resources/Message'
              }
            },
            {
              label: 'Cancel',
              onClick: () => {
                setShowModal(false)
              }
            }
          ]}
        />
      }
      <Box flexShrink={0}>
        <CurrentUserNav
          name={session.email}
          title={session.title}
          avatarUrl={session.avatarUrl}
          dropActions={dropActions}
          lineActions={newMsg? lineActionsFilled: lineActionsNormal}
        />
      </Box>
    </>
    )
}

export default LoggedIn