import {createBrowserRouter} from 'react-router-dom'

import {
    Login,
    Register,
    Classes,
    ClassDetail,
    NewClass,
    EditClass,
    Profile,
    Invite,
    NotFound,
    Index,
    ForgotPassword, ResetPassword, Forbidden, Users
} from '../pages'
import {default as PublicLayout} from './PublicLayout'
import {default as ProtectedLayout} from './ProtectedLayout'
import {default as ExamFlowLayout} from './ExamFlowLayout'

import {StudentExamDetail} from "../components";

const router = createBrowserRouter([
    {
        element: <PublicLayout/>,
        children: [
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword/>
            },
            {
                path: '/reset-password',
                element: <ResetPassword/>
            }
        ]
    },
    {
        element: <ProtectedLayout/>,
        children: [
            {
                path: '/classes',
                element: <Classes/>
            },
            {
                path: '/class/add',
                element: <NewClass/>
            },
            {
                path: '/class/edit/:classId',
                element: <EditClass/>
            },
            {
                path: '/profile/:profileId',
                element: <Profile/>
            },
            {
                path: '/users',
                element: <Users/>
            },

            {
                element: <ExamFlowLayout/>,
                children: [
                    {
                        path: '/class/:id/*',
                        element: <ClassDetail/>
                    },
                    {
                        path: '/class/:id/exam/:examGroupId/doing',
                        element: <StudentExamDetail/>
                    },
                ]
            }
        ],
        errorElement: <NotFound/>
    },
    {
        path: '/invite',
        element: <Invite/>
    },
    {
        path: '/',
        element: <Index/>
    },
    {
        path: '/403',
        element: <Forbidden/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])

export default router;