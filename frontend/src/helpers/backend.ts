export async function sendMessageToServer(message: string): Promise<{ role: 'bot', text: string, isApproval?: boolean }> {
    try {
        
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ message })
    })

    if (!res.ok) throw new Error('Message failed')

    const data = await res.json()

    return {
        role: 'bot',
        text: data.message,
        isApproval: data.isApproval || false
    }
    } catch (error) {
        console.error('Error in sendMessageToServer:', error);
        return {
            role: 'bot',
            text: '❌ Sorry, something went wrong while sending your message.'
        };
    }
};

export async function clearChatSession(): Promise<boolean> {
    try {
        const res = await fetch('/api/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to clear chat session');
        return true;
    } catch (error) {
        console.error('Error in clearChatSession:', error);
        return false;
    }
}