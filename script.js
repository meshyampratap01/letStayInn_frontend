document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const message = document.getElementById('message');
    const downloadForm = document.getElementById('downloadForm');
    const downloadInput = document.getElementById('downloadInput');
    const downloadMsg = document.getElementById('downloadMsg');

    // Separate async function for uploading a file
    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/v1/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                return { success: true, message: 'File uploaded successfully!' };
            } else {
                const err = await res.text();
                return { success: false, message: err || 'Upload failed.' };
            }
        } catch (err) {
            return { success: false, message: 'Network error.' };
        }
    }

    // Separate async function for downloading a file by ID
    async function downloadFileById(fileId) {
        const url = `/api/v1/files/${fileId}/download`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('File not found');
            const blob = await res.blob();
            // Try to get filename from Content-Disposition header
            let filename = `file_${fileId}`;
            const disposition = res.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('filename=') !== -1) {
                filename = disposition.split('filename=')[1].replace(/['"]/, '');
            }
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            return { success: true, message: 'Download started.' };
        } catch (err) {
            return { success: false, message: err.message || 'Download failed.' };
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        message.textContent = '';
        message.className = 'message';

        const file = fileInput.files[0];
        if (!file) {
            message.textContent = 'Please select a file.';
            message.classList.add('error');
            return;
        }

        const result = await uploadFile(file);
        message.textContent = result.message;
        if (!result.success) {
            message.classList.add('error');
        }
    });

    downloadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        downloadMsg.textContent = '';
        downloadMsg.className = 'message';
        const fileId = downloadInput.value.trim();
        if (!fileId) {
            downloadMsg.textContent = 'Please enter a file ID.';
            downloadMsg.classList.add('error');
            return;
        }
        const result = await downloadFileById(fileId);
        downloadMsg.textContent = result.message;
        if (!result.success) {
            downloadMsg.classList.add('error');
        }
    });
});
