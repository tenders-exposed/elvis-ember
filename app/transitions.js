export default function() {

  const duration = 100;

  this.transition(
    this.use('toLeft', { duration: duration }),
    this.reverse('toRight', { duration: duration })
  );

  this.transition(
    this.toRoute('network.query'),
    this.use('toLeft', { duration: duration }),
    this.reverse('toRight', { duration: duration })
  );


  this.transition(
    this.fromRoute('network.query'),
    this.use('fade', { duration: duration }),
  );

}
