export function captureVideoFrame (video, canvas, format, quality) {
    if (typeof video === 'string') {
        video = document.getElementById(video);
    }
    if (canvas === null) {
        canvas = document.createElement("CANVAS");
    }else if (typeof canvas === 'string') {
        canvas = document.getElementById(canvas);
    }

    format = format || 'jpeg';
    quality = quality || 0.92;

    if (!video || (format !== 'png' && format !== 'jpeg')) {
        return false;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUri = canvas.toDataURL('image/' + format, quality);
    const data = dataUri.split(',')[1];
    const mimeType = dataUri.split(';')[0].slice(5)

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([arr], {type: mimeType});
    return {blob: blob, dataUri: dataUri, format: format};
}