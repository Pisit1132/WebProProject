<template>
  <div class="booking-page container-fluid text-light py-5" style="background-color: #010922;">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">EXCLUSIVE</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/events">Events</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-danger" @click="logout">Logout</button>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">{{ userName }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-5">
      <h2 class="text-center">CONFIRM BOOKING</h2>
      <div class="card bg-dark text-light p-4">
        <div class="row">
          <div class="col-md-4">
            <img :src="event.image" alt="Event Image" class="img-fluid">
          </div>
          <div class="col-md-8">
            <h3>CLUB: {{ event.name }}</h3>
            <p>MATCH: {{ event.match }}%</p>
            <p>DATE: {{ event.date }}</p>
            <p>STATUS: <span :class="event.status === 'AVAILABLE' ? 'text-success' : 'text-danger'">{{ event.status }}</span></p>
          </div>
        </div>
        <form @submit.prevent="confirmBooking" class="mt-4">
          <div class="mb-3">
            <label for="bookingName" class="form-label">BOOKING NAME:</label>
            <input type="text" class="form-control" id="bookingName" v-model="bookingName" required>
          </div>
          <div class="mb-3">
            <label for="amount" class="form-label">AMOUNT:</label>
            <input type="number" class="form-control" id="amount" v-model="amount" required>
          </div>
          <div class="mb-3">
            <label for="specialRequest" class="form-label">SPECIAL REQUEST:</label>
            <textarea class="form-control" id="specialRequest" v-model="specialRequest"></textarea>
          </div>
          <div class="mb-3">
            <label for="paymentMethod" class="form-label">PAYMENT METHOD:</label>
            <select class="form-select" id="paymentMethod" v-model="paymentMethod">
              <option value="QR PROMPTPAY">QR PROMPTPAY</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">CONFIRM</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: {},
      bookingName: '',
      amount: 1,
      specialRequest: '',
      paymentMethod: 'QR PROMPTPAY'
    };
  },
  created() {
    const eventId = this.$route.params.id;
    // Fetch event details using eventId
    // For simplicity, we'll use dummy data
    this.event = {
      id: eventId,
      image: 'https://example.com/event-image.jpg',
      name: 'MILEY ISC',
      match: 95,
      date: '1/9/24',
      status: 'AVAILABLE'
    };
  },
  methods: {
    async confirmBooking() {
      try {
        const response = await fetch('http://localhost:3000/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify({
            eventId: this.event.id,
            amount: this.amount,
            specialRequest: this.specialRequest
          })
        });

        if (!response.ok) {
          throw new Error('Failed to confirm booking');
        }

        alert('Booking confirmed!');
        this.$router.push('/events');
      } catch (error) {
        console.error('Error during booking:', error);
        alert(error.message);
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('user');
    }
  }
};
</script>

<style scoped>
.booking-page {
  background-color: #010922;
}
</style>
