class SerialPortManager {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.isConnected = false;
        
        this.initializeElements();
        this.bindEvents();
        this.checkWebSerialSupport();
    }
    
    initializeElements() {
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.sendBtn = document.getElementById('sendBtn');
        this.statusText = document.getElementById('statusText');
        this.output = document.getElementById('output');
        this.messageInput = document.getElementById('messageInput');
        this.statusDiv = document.querySelector('.status');
    }
    
    bindEvents() {
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());
        this.clearBtn.addEventListener('click', () => this.clearOutput());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    checkWebSerialSupport() {
        if (!('serial' in navigator)) {
            this.log('Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera.', 'error');
            this.connectBtn.disabled = true;
        }
    }
    
    async connect() {
        try {
            // Request a port and open a connection
            this.port = await navigator.serial.requestPort();
            
            // Open the serial port with ESP32 settings
            await this.port.open({ 
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
            });
            
            this.isConnected = true;
            this.updateUI();
            this.log('Connected to serial port', 'info');
            
            // Start reading data
            this.startReading();
            
        } catch (error) {
            console.error('Error connecting to serial port:', error);
            this.log(`Error connecting: ${error.message}`, 'error');
        }
    }
    
    async disconnect() {
        try {
            if (this.reader) {
                await this.reader.cancel();
                this.reader.releaseLock();
                this.reader = null;
            }
            
            if (this.writer) {
                this.writer.releaseLock();
                this.writer = null;
            }
            
            if (this.port) {
                await this.port.close();
                this.port = null;
            }
            
            this.isConnected = false;
            this.updateUI();
            this.log('Disconnected from serial port', 'info');
            
        } catch (error) {
            console.error('Error disconnecting:', error);
            this.log(`Error disconnecting: ${error.message}`, 'error');
        }
    }
    
    async startReading() {
        try {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            this.reader = textDecoder.readable.getReader();
            
            // Listen to data coming from the serial device
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    break;
                }
                this.log(value);
            }
            
        } catch (error) {
            console.error('Error reading from serial port:', error);
            this.log(`Error reading: ${error.message}`, 'error');
        }
    }
    
    async sendMessage() {
        if (!this.isConnected || !this.port) {
            this.log('Not connected to a serial port', 'error');
            return;
        }
        
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        try {
            if (!this.writer) {
                const textEncoder = new TextEncoderStream();
                const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
                this.writer = textEncoder.writable.getWriter();
            }
            
            await this.writer.write(message + '\n');
            this.log(`Sent: ${message}`, 'info');
            this.messageInput.value = '';
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.log(`Error sending: ${error.message}`, 'error');
        }
    }
    
    updateUI() {
        this.connectBtn.disabled = this.isConnected;
        this.disconnectBtn.disabled = !this.isConnected;
        this.sendBtn.disabled = !this.isConnected;
        this.messageInput.disabled = !this.isConnected;
        
        if (this.isConnected) {
            this.statusText.textContent = 'Connected';
            this.statusDiv.className = 'status connected';
        } else {
            this.statusText.textContent = 'Not connected';
            this.statusDiv.className = 'status disconnected';
        }
    }
    
    log(message, type = 'normal') {
        const timestamp = new Date().toLocaleTimeString();
        const timestampSpan = `<span class="timestamp">[${timestamp}]</span> `;
        
        let messageHTML = '';
        if (type === 'error') {
            messageHTML = `<span class="error">${message}</span>`;
        } else if (type === 'info') {
            messageHTML = `<span class="info">${message}</span>`;
        } else {
            messageHTML = this.escapeHtml(message);
        }
        
        this.output.innerHTML += timestampSpan + messageHTML + '\n';
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    clearOutput() {
        this.output.innerHTML = '';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the serial port manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SerialPortManager();
});