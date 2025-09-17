import { useMemo, useState } from 'react'
import { Button } from './ui/button'
import { serialize, deserialize } from '@/utils/SerializeUtils'

export const Serializer = () => {
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [mode, setMode] = useState<'serialize' | 'deserialize'>('serialize')

    const stats = useMemo(() => {
        const inSize = input.length
        const outSize = output.length
        return {
            inSize,
            outSize,
            delta: outSize - inSize
        }
    }, [input, output])

    const handleRun = () => {
        try {
            if (mode === 'serialize') {
                setOutput(serialize(input, false))
            } else {
                setOutput(deserialize(input))
            }
        } catch (e) {
            setOutput(`Error: ${(e as Error).message}`)
        }
    }

    const handleSwap = () => {
        setInput(output)
        setOutput("")
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output)
        } catch { void 0 }
    }

    const clearAll = () => {
        setInput("")
        setOutput("")
    }

    // Beautify helpers
    const beautifyHtmlWithTwig = (source: string): string => {
        if (!source) return source
        const twigBlocks: string[] = []
        const twigPlaceholderPrefix = "___TWIG_BLOCK_"
        const twigPlaceholderSuffix = "___"

        // Extract Twig blocks
        let working = source.replace(/\{%[\s\S]*?%\}/g, (m) => {
            const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`
            twigBlocks.push(m)
            return placeholder
        })
        working = working.replace(/\{\{[\s\S]*?\}\}/g, (m) => {
            const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`
            twigBlocks.push(m)
            return placeholder
        })
        working = working.replace(/\{#[\s\S]*?#\}/g, (m) => {
            const placeholder = `${twigPlaceholderPrefix}${twigBlocks.length}${twigPlaceholderSuffix}`
            twigBlocks.push(m)
            return placeholder
        })

        const voidTags = new Set([
            'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'
        ])

        const preserveTags = new Set(['pre', 'textarea'])

        const tokens: { type: 'tag' | 'text', value: string }[] = []
        const regex = /(<!--[\s\S]*?-->|<[^>]+>)|([^<]+)/g
        let match: RegExpExecArray | null
        while ((match = regex.exec(working)) !== null) {
            if (match[1]) tokens.push({ type: 'tag', value: match[1] })
            else if (match[2]) tokens.push({ type: 'text', value: match[2] })
        }

        let indentLevel = 0
        const indentUnit = '  '
        const lines: string[] = []
        let inPreserve: string | null = null

        const pushLine = (content: string) => {
            lines.push(`${indentUnit.repeat(Math.max(indentLevel, 0))}${content}`)
        }

        const getTagName = (tag: string): string => {
            const m = tag.match(/^<\/?\s*([a-zA-Z0-9:-]+)/)
            return m ? m[1].toLowerCase() : ''
        }

        for (const token of tokens) {
            if (token.type === 'tag') {
                const raw = token.value
                const isComment = /^<!--/.test(raw)
                const isDoctype = /^<![^-]/i.test(raw)
                const isClosing = /^<\//.test(raw)
                const isSelfClosing = /\/>\s*$/.test(raw)
                const tagName = getTagName(raw)

                if (inPreserve && !(isClosing && tagName === inPreserve)) {
                    // Inside preserve block, keep tags as-is
                    lines.push(raw)
                    continue
                }

                if (isComment || isDoctype) {
                    pushLine(raw.trim())
                    continue
                }

                const isVoid = voidTags.has(tagName)

                if (isClosing && !isSelfClosing && !isVoid) {
                    indentLevel = Math.max(indentLevel - 1, 0)
                    pushLine(raw.trim())
                    if (inPreserve && tagName === inPreserve) inPreserve = null
                    continue
                }

                pushLine(raw.trim())

                if (!isClosing && !isSelfClosing && !isVoid) {
                    if (preserveTags.has(tagName)) {
                        inPreserve = tagName
                    }
                    indentLevel++
                }
            } else {
                const text = token.value
                if (!text) continue
                if (inPreserve) {
                    // Keep text exactly inside preserve tags
                    const rawLines = text.split(/\r?\n/)
                    for (const l of rawLines) {
                        lines.push(l)
                    }
                } else {
                    const trimmed = text.replace(/\s+/g, ' ').trim()
                    if (trimmed) pushLine(trimmed)
                }
            }
        }

        const pretty = lines.join('\n')
        // Restore Twig blocks
        return pretty.replace(new RegExp(`${twigPlaceholderPrefix}(\\d+)${twigPlaceholderSuffix}`, 'g'), (_m, i) => {
            return twigBlocks[parseInt(i)]
        })
    }

    const handleBeautify = () => {
        try {
            if (!output) return
            if (mode === 'serialize') {
                const readable = deserialize(output)
                const pretty = beautifyHtmlWithTwig(readable)
                setOutput(serialize(pretty, false))
            } else {
                const pretty = beautifyHtmlWithTwig(output)
                setOutput(pretty)
            }
        } catch (e) {
            setOutput(`Error: ${(e as Error).message}`)
        }
    }

    return (
        <div className='flex p-5 gap-5 h-[90vh]'>
            <div className='w-1/2 flex flex-col gap-2 h-full'>
                <div className='flex items-center justify-between'>
                    <div className='font-semibold text-base'>Input</div>
                    <div className='flex items-center gap-2'>
                        <Button variant={mode === 'serialize' ? 'default' : 'outline'} onClick={() => setMode('serialize')}>Serialize</Button>
                        <Button variant={mode === 'deserialize' ? 'default' : 'outline'} onClick={() => setMode('deserialize')}>Deserialize</Button>
                        <Button variant={'outline'} onClick={clearAll}>Clear</Button>
                    </div>
                </div>
                <div className='flex-1 rounded-lg overflow-hidden'>
                    <textarea
                        className='w-full h-full bg-[#1e1e1e] rounded-lg p-3 outline-none resize-none'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'serialize' ? 'Paste raw HTML (with Twig) to serialize…' : 'Paste escaped HTML to deserialize…'}
                    />
                </div>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <div>Input: {stats.inSize.toLocaleString()} chars</div>
                    <div>
                        {mode === 'serialize' ? 'Escapes HTML while preserving Twig blocks' : 'Restores readable HTML from escaped string'}
                    </div>
                </div>
            </div>

            <div className='w-1/2 flex flex-col gap-2 h-full'>
                <div className='flex items-center justify-between'>
                    <div className='font-semibold text-base'>Output</div>
                    <div className='flex items-center gap-2'>
                        <Button onClick={handleRun}>Run</Button>
                        <Button variant={'outline'} onClick={handleBeautify}>Beautify</Button>
                        <Button variant={'outline'} onClick={handleSwap}>Use as Input</Button>
                        <Button variant={'outline'} onClick={handleCopy}>Copy</Button>
                    </div>
                </div>
                <div className='flex-1 rounded-lg overflow-hidden'>
                    <textarea
                        readOnly
                        className='w-full h-full bg-[#0f0f0f] rounded-lg p-3 outline-none resize-none'
                        value={output}
                        placeholder='Output appears here…'
                    />
                </div>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <div>Output: {stats.outSize.toLocaleString()} chars</div>
                    <div>Δ: {stats.delta >= 0 ? '+' : ''}{stats.delta.toLocaleString()} chars</div>
                </div>
            </div>
        </div>
    )
}


