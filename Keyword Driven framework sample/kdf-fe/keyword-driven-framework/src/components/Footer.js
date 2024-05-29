import React from 'react'

const Footer = () => {
    return (
        <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%' }}>
            <footer class="text-center text-black" style={{ backgroundColor: 'dark-grey', fontStyle:'italic' }} >
                <div class="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2024 Copyright: Tarento India
                </div>
            </footer>
        </div>
    )
}

export default Footer