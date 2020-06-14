import React from 'react'

import { PinchZoom } from 'react-ivy-pinch-zoom'
import 'react-ivy-pinch-zoom/dist/pinch-zoom.css'

const App = () => {
  return <PinchZoom imgPath="https://images.unsplash.com/photo-1528919880398-4af90c12ac1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
}

export default App