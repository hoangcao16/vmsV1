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

    let dataUri = canvas.toDataURL('image/' + format, quality);
    let data = dataUri.split(',')[1];
    let mimeType = dataUri.split(';')[0].slice(5)

    let bytes = window.atob(data);
    let buf = new ArrayBuffer(bytes.length);
    let arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([arr], {type: mimeType});

    // Thumbnail image
    canvas.width = 134;
    canvas.height = 84;

    canvas.getContext('2d').drawImage(video, 0, 0, 134, 84);

    dataUri = canvas.toDataURL('image/' + format, quality);
    data = dataUri.split(',')[1];
    mimeType = dataUri.split(';')[0].slice(5)

    bytes = window.atob(data);
    buf = new ArrayBuffer(bytes.length);
    arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    const tBlob = new Blob([arr], {type: mimeType});

    return {blob: blob, dataUri: dataUri, format: format, tBlob: tBlob};
}