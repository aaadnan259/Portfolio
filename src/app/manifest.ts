import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Adnan Ashraf Portfolio',
        short_name: 'Adnan Portfolio',
        description: 'Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0D1117',
        theme_color: '#0D1117',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
