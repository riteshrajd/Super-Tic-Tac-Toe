class PeerService {
  constructor() {
    // Initialize the RTCPeerConnection
    // A STUN server is used to discover your public IP address
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });
  }
  
  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }
  
  async getAnswer(offer) {
    if (this.peer) {
      // Set the incoming offer as the "remote description"
      await this.peer.setRemoteDescription(offer);
      // Create the answer
      const answer = await this.peer.createAnswer();
      // Set the answer as the "local description"
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));

      return answer;
    }
  }

  async setRemoteDescription(answer) {
    if (this.peer) {
      // Set the incoming answer as the "remote description"
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async addIceCandidate(candidate) {
    if (this.peer) {
      const iceCandidate = new RTCIceCandidate(candidate);
      await this.peer.addIceCandidate(iceCandidate);
    }
  }

}

export default new PeerService();