
const routes = [
  {
    path: '/account',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/notifications', component: () => import('pages/Notifications.vue') },
      { path: '/transactions', component: () => import('pages/Transactions.vue') },
      { path: '/viewTransations/:id', component: () => import('pages/Transactions2.vue') },
      { path: '/profile', component: () => import('pages/Profile.vue') },
      { path: '/quota', component: () => import('pages/views/QuotaDetails.vue') }, 
      { path: '/cashadvance', component: () => import('pages/views/CashAdvanceDetails.vue') }, 
      { path: '/bill', component: () => import('pages/views/BillingDetails.vue') },
      { path: '/reciept', component: () => import('pages/views/TransactionDetails.vue') },   
      { path: '/drivers', component: () => import('pages/Drivers.vue') }, 
      { path: '/adddriver', component: () => import('pages/AddDriver.vue') }, 
    ],
  },
  {
    path: '/',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/changepassword', component: () => import('pages/ChangePassword.vue') },  
    ],
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
