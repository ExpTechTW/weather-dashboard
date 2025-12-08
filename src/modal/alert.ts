export default interface WeatherAlert {
  id: string;
  status: number;
  type: string;
  author: 'cwa' | 'trem';
  time: {
    send: number;
    expires: {
      all: number;
    };
  };
  text: {
    content: {
      all: {
        title: string;
        subtitle: string;
      };
    };
    description: {
      all: string;
    };
  };
  area: number[];
  icon: string;
}
