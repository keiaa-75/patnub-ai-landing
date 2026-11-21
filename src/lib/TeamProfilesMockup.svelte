<script>
  const team = [
    {
      name: 'Marlon Isaguirre',
      role: 'Project Lead',
      initials: 'MI',
      username: 'SussyMarlony',
      color: 'mint'
    },
    {
      name: 'Julian Macato',
      role: 'Full-Stack Developer',
      initials: 'JM',
      username: 'fancybaby404',
      color: 'peach'
    },
    {
      name: 'Ravin Aguelo',
      role: 'Runtime Engineer',
      initials: 'RA',
      username: 'RavinEduard',
      color: 'blue'
    },
    {
      name: 'Jill Abarte',
      role: 'Backend Developer',
      initials: 'JA',
      username: 'keiaa-75',
      color: 'lavender'
    }
  ];
</script>

<div class="mockup">
  <div class="landscape">
    <div class="team-grid">
      {#each team as member}
        <article class="profile-card">
          <div
            class="portrait"
            class:mint={member.color === 'mint'}
            class:peach={member.color === 'peach'}
            class:blue={member.color === 'blue'}
            class:lavender={member.color === 'lavender'}
          >
            <span class="initials">{member.initials}</span>

            <img
              src={`https://github.com/${member.username}.png?size=256`}
              alt=""
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
              loading="eager"
              onerror={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <h3>{member.name}</h3>

          <p>{member.role}</p>
        </article>
      {/each}
    </div>
  </div>
</div>

<style>
  .mockup {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: hidden;

    background: #f5faf8;

    font-family: 'Roboto', Arial, sans-serif;
  }

  /*
    The inner screen uses landscape dimensions.

    It rotates in the opposite direction to the physical
    phone so its profile cards remain upright.
  */

  .landscape {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 216.6667%;
    height: 46.1538%;

    display: flex;

    padding: 4.5% 4%;

    background: #f5faf8;

    transform:
      translate(-50%, -50%)
      rotate(-90deg);

    transform-origin: center;
  }

  .team-grid {
    display: grid;

    grid-template-columns: repeat(4, minmax(0, 1fr));

    gap: 2%;

    width: 100%;
    height: 100%;
  }

  .profile-card {
    min-width: 0;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    padding: 5% 3%;

    border: 1px solid #dce9e3;
    border-radius: 16px;

    background: #ffffff;

    text-align: center;

    box-shadow:
      0 4px 14px rgba(27, 58, 49, 0.045);
  }

  .portrait {
    position: relative;

    flex: none;

    width: clamp(36px, 25%, 82px);

    aspect-ratio: 1;

    overflow: hidden;

    display: grid;
    place-items: center;

    margin-bottom: 9%;

    border: 3px solid rgba(255, 255, 255, 0.85);

    border-radius:
      42% 58% 54% 46% /
      50% 43% 57% 50%;

    box-shadow:
      0 3px 10px rgba(27, 58, 49, 0.1);
  }

  .portrait.mint {
    background: #d5f1e9;
  }

  .portrait.peach {
    background: #f8e5d1;
    border-radius: 50% 50% 43% 57%;
  }

  .portrait.blue {
    background: #e0eafa;
    border-radius: 44% 56% 55% 45%;
  }

  .portrait.lavender {
    background: #eee0f1;
    border-radius: 55% 45% 43% 57%;
  }

  .portrait img {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  .initials {
    color: #245e51;

    font-family: 'Fredoka', sans-serif;

    font-size: clamp(12px, 2vw, 24px);

    font-weight: 600;
  }

  .profile-card h3 {
    max-width: 100%;

    margin: 0;

    color: #192923;

    font-family: 'Roboto', sans-serif;

    font-size: clamp(8px, 1.15vw, 14px);

    font-weight: 700;

    line-height: 1.3;

    text-wrap: balance;
    overflow-wrap: anywhere;
  }

  .profile-card p {
    max-width: 100%;

    margin: 5px 0 0;

    color: #62766e;

    font-size: clamp(6px, 0.85vw, 11px);

    font-weight: 500;

    line-height: 1.35;

    text-wrap: balance;
  }
</style>