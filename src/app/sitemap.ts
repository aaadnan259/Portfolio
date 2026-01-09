import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://adnanashraf.dev',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Add other sections as anchors if you want, though the main URL is most important for a single-page portfolio.
    ]
}
