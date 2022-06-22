// Dependencies
const fs = require('uxp').storage.localFileSystem
const application = require('application')
const clipboard = require('clipboard')
const commands = require('commands')
const { createDialog, error } = require('./lib/dialogs.js')
global.Buffer = global.Buffer || require('buffer').Buffer;

// Main function
async function copySvgCode(selection) {
    // Error if nothing selected
    if (!selection.hasArtwork) {
        error('No SVG selected', 'Please select an SVG before running.')
        return
    }

    // Group if multiple selections
    if (selection.items.length >= 2) {
        commands.group()
    }

    // Setup tmp folder and file
    const tmpFolder = await fs.getTemporaryFolder()
    const file = await tmpFolder.createFile('export.svg', {
        overwrite: true
    })

    // Rendition settings
    const renditions = [
        {
            node: selection.items[0],
            outputFile: file,
            type: application.RenditionType.SVG,
            minify: true,
            embedImages: false
        }
    ]

    // Create rendition
    await application.createRenditions(renditions)

    // Read tmp file and generate SVG code
    const markup = await file.read()
    const svgCode = escapeHtml(markup)

    // Copy to clipboard too!
    clipboard.copyText(markup)

    // Show output dialog
    await createDialog({
        title: 'SVG Output',
        template: () => `<input value="${svgCode}">`
    })
}

// Main function
async function copyBase64Code(selection) {
    // Error if nothing selected
    if (!selection.hasArtwork) {
        error('No SVG selected', 'Please select an SVG before running.')
        return
    }

    // Group if multiple selections
    if (selection.items.length >= 2) {
        commands.group()
    }

    // Setup tmp folder and file
    const tmpFolder = await fs.getTemporaryFolder()
    const file = await tmpFolder.createFile('export.svg', {
        overwrite: true
    })

    // Rendition settings
    const renditions = [
        {
            node: selection.items[0],
            outputFile: file,
            type: application.RenditionType.SVG,
            minify: true,
            embedImages: false
        }
    ]

    // Create rendition
    await application.createRenditions(renditions)

    // Read tmp file and generate SVG code
    const markup = await file.read()
    const svgCode = escapeHtml(markup)

    const b64svgPrefix = 'data:image/svg+xml;base64,'
    const base64Code = Buffer.from(markup, 'binary').toString('base64');

    // Copy to clipboard too!
    clipboard.copyText(b64svgPrefix + base64Code)

    // Show output dialog
    await createDialog({
        title: 'Base64 Output',
        template: () => `Base64 String Only: <textarea>${base64Code}</textarea><br />Data URI: <input value="${b64svgPrefix}${base64Code}"><br />CSS Tag<input value="background: url(${b64svgPrefix}${base64Code})">`
    })
}

// Helper(s)
function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function utf8ToB64(str) {
    return ;
}

// Exports
module.exports = {
    commands: {
        copySvgCode,
        copyBase64Code
    }
}
