export const en = {
  game_card: {
    confirm_account: {
      cancel: 'This isn’t my account',
      confirm: 'Selection complete',
      title: 'Verify account',
      wrong_qr_dialog: {
        content:
          'Is this the QR code for the account in your name? Please re-check the image and resubmit.',
        go_to_confirm: 'Go to confirm profile →',
        retry: 'Re-upload screenshot',
        title: 'Having trouble scanning the QR.',
      },
    },
    search_account: {
      disclaimer:
        '*Registration will be denied if the account is not in your name.',
      error: {
        not_found_account: 'This account doesn’t exist.',
        not_selected_account: 'Please select an account',
      },
      search_input: {
        default: {
          label: 'Please enter the player name',
          placeholder: 'Player name',
        },
        error: {
          invalid_format: 'Invalid format. Please use “{{format}}”',
          required: 'Please enter a nicknam',
        },
        fconline: {
          label: 'Please enter the team-owner name',
          placeholder: 'Nickname',
        },
        lol: {
          label: 'Please enter the summoner name',
          placeholder: 'SummonerName#Tag',
        },
        val: {
          label: 'Please enter the player name',
          placeholder: 'PlayerName#Tag',
        },
      },
      title: 'Search account',
    },
    select_game: {
      subtitle: 'Select the sport for the card you want to register',
      title: 'Select sport',
    },
    upload_screenshot: {
      guide: {
        default: {
          description:
            'To verify that the account is in your name,\nplease submit a screenshot of <b>My Profile</b>.',
          example_image_caption: 'Screenshot example :',
          example_image_description: 'Click to view full screen',
          go_to_confirm: 'Go to confirm profile →',
          title: 'Screenshot upload guide',
        },
      },
      subtitle: 'Screenshot for account-ownership verification',
      title: 'Account ownership verification',
    },
  },
  common: {
    label: {
      next: 'Next',
      register: 'Register',
      upload: 'Upload',
    },
    network_error_dialog: {
      message: 'Please try again later.',
      title: 'A problem occurred.',
    },
  },
} as const;
