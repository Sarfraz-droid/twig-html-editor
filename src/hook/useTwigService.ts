import { useStore } from '@/store/store';
import React from 'react'
import Twig from 'twig'

export const useTwigService = () => {
    const { html, json, renderedHtml, setRenderedHtml } = useStore();

    const renderHtml = () => {
        try {
            const twig = Twig.twig({
                data: html,
            })

            console.log(html)

            const renderedHtml = twig.render(JSON.parse(json))

            console.log(renderedHtml)

            setRenderedHtml(renderedHtml)
        } catch (error) {
            console.error(error)
            setRenderedHtml(`${JSON.stringify(error)}`)
        }
    }

    return {
        renderHtml,
        renderedHtml
    }
}
