<script>
  import { push } from "svelte-spa-router";
  import { postData } from "../../App.svelte";
  import {
    user,
    successMessage,
    failureMessage
  } from "../../stores/authstore.js";
  let email = "";
  let password = "";
  let confirmPassword = "";

  const signupUrl = "http://localhost:4004/api/auth/signup";

  function signup() {
    postData(signupUrl, { email, password, confirmPassword }, "Hello signup")
      .then(data => {
        if (data.success) {
          console.log(
            "We have sent you an email with link to activate your account. Please check your email and activate your account by clicking the link.",
            data.success
          );
          $successMessage = data.success;
          push("/");
        } else {
          console.log(data.message);
          $failureMessage = data.message;
        }
      })
      .catch(err => {
        console.log(err.response.message);
      });
  }
</script>

<style>
  h2 {
    text-align: center;
    letter-spacing: 2px;
  }
  form {
    width: 100%;
    max-width: 650px;
    padding: 20px;
    margin: 20px auto;
    background: rgb(231, 233, 240);
  }
  label {
    width: 80%;
    margin: 4px auto;
    letter-spacing: 2px;
    font-size: 0.9em;
  }
  input {
    all: unset;
    display: block;
    width: 80%;
    transition: 300ms all ease-in-out;
    margin: auto;
    background: white;
    padding: 4px;
    margin-bottom: 4px;
  }
  input[type="submit"] {
    text-align: center;
    letter-spacing: 2px;
    background: darkblue;
    color: white;
    cursor: pointer;
  }
  input:focus,
  input[type="submit"]:hover {
    width: 100%;
  }
  p {
    text-align: center;
  }
</style>

{#if !$user}
  <main>
    {#if $failureMessage}
      <p>{$failureMessage}</p>
    {/if}
    <form on:submit|preventDefault={signup}>
      <h2 class="page-title">Signup</h2>
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} reaquired />
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
      <label for="confirmPassword">Re-type Password</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required />
      <input type="submit" value="Signup" />
    </form>
    <p>
      Have an account? You can
      <a href="#/login">Login to your account.</a>
    </p>
  </main>
{/if}
