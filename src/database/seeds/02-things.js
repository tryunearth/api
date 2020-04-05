exports.seed = function(knex) {
  return knex('thing').insert([
    {
      subreddit: 'tryunearth',
      selftext: '',
      title: 'If you’re reading this, go try unearth',
      subreddit_name_prefixed: 'r/tryunearth',
      name: 't3_eh2xu5',
      author_fullname: 't2_a9cqu',
      category: null,
      thumbnail:
        'https://b.thumbs.redditmedia.com/u6G7jg7OFjIremTzGSaaJr3hhkFDPTJN6L3osTrt-Xo.jpg',
      score: 5,
      over_18: false,
      id: 'eh2xu5',
      author: 'Cedricium',
      permalink:
        '/r/tryunearth/comments/eh2xu5/if_youre_reading_this_go_try_unearth/',
      url: 'https://www.tryunearth.com/',
      created_utc: 1577602614,
      surfaced: true,
      user_id: 'xmeax',
    },
    {
      subreddit: 'malelivingspace',
      selftext: '',
      title:
        "Alexa, play, 'Eat, Sleep, Wake, (Nothing But You)' by Bombay Bicycle Club",
      subreddit_name_prefixed: 'r/malelivingspace',
      name: 't3_ffve1h',
      author_fullname: 't2_a28tf',
      category: null,
      thumbnail:
        'https://b.thumbs.redditmedia.com/7Zh_6lyidt9wfAQN6uSQcdlsPPHiSm-Mw2coMtFSJpk.jpg',
      score: 5151,
      over_18: false,
      id: 'ffve1h',
      author: 'ggill1313',
      permalink:
        '/r/malelivingspace/comments/ffve1h/alexa_play_eat_sleep_wake_nothing_but_you_by/',
      url: 'https://i.redd.it/qm9l2mulinl41.jpg',
      created_utc: 1583763779,
      surfaced: false,
      user_id: 'xmeax',
    },
    {
      subreddit: 'ProgrammerHumor',
      selftext: '',
      title: '...just like the previous build.',
      subreddit_name_prefixed: 'r/ProgrammerHumor',
      name: 't3_fur149',
      author_fullname: 't2_11dywf',
      category: null,
      thumbnail:
        'https://b.thumbs.redditmedia.com/MnGWF35T2kGh3VlQSRa1pzG6KIRD6lTMn_VTlhVpxSE.jpg',
      score: 41258,
      over_18: false,
      id: 'fur149',
      author: 'ApostOnReddit',
      permalink:
        '/r/ProgrammerHumor/comments/fur149/just_like_the_previous_build/',
      url: 'https://i.redd.it/kk6ghtkywrq41.png',
      created_utc: 1585994017,
      surfaced: true,
      user_id: 'a9cqu',
    },
    {
      subreddit: 'beta',
      selftext:
        'I just went through my saved posts, and there’s like a million of them. It’s at the point now that the more I save posts the more useless saving posts becomes. Give me some folders I can name and move saved posts into and I’d be good. Again, sorry if this exists already, I didn’t see it on mobile.',
      title:
        'Not sure if this feature exists already, but a way to sort saved posts into folders would be pretty damn cool.',
      subreddit_name_prefixed: 'r/beta',
      name: 't3_eubyfg',
      author_fullname: 't2_f3pjm',
      category: null,
      thumbnail: 'self',
      score: 410,
      over_18: false,
      id: 'eubyfg',
      author: 'SuperiorAmerican',
      permalink:
        '/r/beta/comments/eubyfg/not_sure_if_this_feature_exists_already_but_a_way/',
      url:
        'https://www.reddit.com/r/beta/comments/eubyfg/not_sure_if_this_feature_exists_already_but_a_way/',
      created_utc: 1580069082,
      surfaced: false,
      user_id: 'a9cqu',
    },
  ])
}
