const FFS = [
  { left: '8%',  top: '15%', dur: '14s', delay: '0s',    blink: '2.2s', bd: '0s',    x1: '40px',  y1: '-30px', x2: '-20px', y2: '-60px', x3: '25px',  y3: '-15px' },
  { left: '18%', top: '55%', dur: '11s', delay: '-4s',   blink: '3.1s', bd: '-1s',   x1: '-35px', y1: '-25px', x2: '20px',  y2: '-50px', x3: '-10px', y3: '-30px' },
  { left: '30%', top: '25%', dur: '16s', delay: '-2s',   blink: '2.6s', bd: '-0.5s', x1: '50px',  y1: '-40px', x2: '-30px', y2: '-20px', x3: '15px',  y3: '-55px' },
  { left: '42%', top: '70%', dur: '13s', delay: '-6s',   blink: '1.9s', bd: '-1.5s', x1: '-40px', y1: '-35px', x2: '30px',  y2: '-60px', x3: '-20px', y3: '-25px' },
  { left: '55%', top: '10%', dur: '18s', delay: '-1s',   blink: '2.8s', bd: '-0.8s', x1: '30px',  y1: '-50px', x2: '-50px', y2: '-20px', x3: '40px',  y3: '-35px' },
  { left: '62%', top: '45%', dur: '12s', delay: '-8s',   blink: '3.4s', bd: '-2s',   x1: '-25px', y1: '-45px', x2: '45px',  y2: '-30px', x3: '-35px', y3: '-55px' },
  { left: '75%', top: '20%', dur: '15s', delay: '-3s',   blink: '2.0s', bd: '-0.3s', x1: '35px',  y1: '-55px', x2: '-45px', y2: '-25px', x3: '20px',  y3: '-40px' },
  { left: '85%', top: '65%', dur: '10s', delay: '-5s',   blink: '2.5s', bd: '-1.2s', x1: '-30px', y1: '-40px', x2: '25px',  y2: '-55px', x3: '-15px', y3: '-30px' },
  { left: '92%', top: '35%', dur: '17s', delay: '-7s',   blink: '3.0s', bd: '-0.7s', x1: '20px',  y1: '-35px', x2: '-40px', y2: '-50px', x3: '30px',  y3: '-20px' },
  { left: '22%', top: '80%', dur: '13s', delay: '-9s',   blink: '1.8s', bd: '-1.8s', x1: '45px',  y1: '-20px', x2: '-20px', y2: '-60px', x3: '10px',  y3: '-45px' },
  { left: '48%', top: '88%', dur: '11s', delay: '-2.5s', blink: '2.9s', bd: '-0.4s', x1: '-55px', y1: '-30px', x2: '35px',  y2: '-40px', x3: '-25px', y3: '-55px' },
  { left: '68%', top: '78%', dur: '16s', delay: '-4.5s', blink: '2.3s', bd: '-1.6s', x1: '25px',  y1: '-55px', x2: '-35px', y2: '-20px', x3: '50px',  y3: '-40px' },
  { left: '5%',  top: '50%', dur: '14s', delay: '-6.5s', blink: '3.2s', bd: '-0.9s', x1: '40px',  y1: '-40px', x2: '-30px', y2: '-55px', x3: '20px',  y3: '-25px' },
  { left: '38%', top: '5%',  dur: '19s', delay: '-3.5s', blink: '2.1s', bd: '-2.2s', x1: '-20px', y1: '-50px', x2: '55px',  y2: '-30px', x3: '-40px', y3: '-45px' },
  { left: '80%', top: '90%', dur: '12s', delay: '-1.5s', blink: '2.7s', bd: '-1.1s', x1: '30px',  y1: '-25px', x2: '-50px', y2: '-45px', x3: '15px',  y3: '-60px' },
]

export default function Fireflies() {
  return (
    <div className="fireflies">
      {FFS.map((f, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            left: f.left,
            top: f.top,
            '--ff-dur':    f.dur,
            '--ff-delay':  f.delay,
            '--ff-blink':  f.blink,
            '--ff-bdelay': f.bd,
            '--ff-x1': f.x1, '--ff-y1': f.y1,
            '--ff-x2': f.x2, '--ff-y2': f.y2,
            '--ff-x3': f.x3, '--ff-y3': f.y3,
          }}
        />
      ))}
    </div>
  )
}
