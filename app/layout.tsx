import type {Metadata,Viewport} from 'next'
import './globals.css'
export const metadata:Metadata={title:'EchoLab — Creator workspace',description:'A multilingual content studio with adaptive brand memory.',icons:{icon:'/echo.svg'}}
export const viewport:Viewport={colorScheme:'light',themeColor:'#101e2c'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="light"><body className="antialiased">{children}</body></html>}
