export const ko = {
  game_card: {
    confirm_account: {
      cancel: '제 계정이 아니에요',
      confirm: '선택 완료',
      title: '계정 확인',
      wrong_qr_dialog: {
        content:
          '본인 명의의 계정의 QR이 맞나요?\n이미지를 다시 확인해 제출해주세요.',
        go_to_confirm: '프로필 확인하러 가기 →',
        retry: '스크린샷 재업로드',
        title: 'QR 인식이 어려워요',
      },
    },
    search_account: {
      disclaimer: '*본인명의의 계정이 아닐 경우 등록 거절됩니다.',
      error: {
        not_found_account: '존재하지 않는 계정입니다',
        not_selected_account: '계정을 선택해주세요',
      },
      search_input: {
        default: {
          label: '플레이어명을 알려주세요',
          placeholder: '플레이어명',
        },
        error: {
          invalid_format:
            "올바른 형식이 아닙니다. '{{format}}' 형식으로 입력해주세요",
          required: '닉네임을 입력해주세요',
        },
        fconline: {
          label: '구단주명을 입력해주세요',
          placeholder: '닉네임',
        },
        lol: {
          label: '소환사명을 입력해주세요',
          placeholder: '소환사명#태그',
        },
        val: {
          label: '플레이어명을 알려주세요',
          placeholder: '플레이어명#태그',
        },
      },
      title: '계정 검색',
    },
    select_game: {
      subtitle: '등록할 카드의 종목을 선택해주세요',
      title: '종목 선택',
    },
    upload_screenshot: {
      guide: {
        default: {
          description:
            '본인 명의 계정을 확인하기 위해\n<b>나의 프로필</b> 스크린샷을 제출해주세요.',
          example_image_caption: '스크린샷 예시 :',
          example_image_description: '클릭 시 전체화면을 볼 수 있어요',
          go_to_confirm: '프로필 확인하러 가기 →',
          title: '스크린샷 업로드 가이드',
        },
      },
      subtitle: '본인 명의 계정 확인 스크린샷',
      title: '본인 명의 계정 확인',
    },
  },
  common: {
    label: {
      next: '다음',
      register: '등록',
      upload: '업로드',
    },
    network_error_dialog: {
      message: '잠시 후 다시 시도해주세요.',
      title: '문제가 발생했습니다.',
    },
  },
} as const;
