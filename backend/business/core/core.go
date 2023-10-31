package core

import (
	"context"
)

type Collector interface {
	Collect(ctx context.Context) ([]error)
}

type Core struct {
	collectors []Collector
}

func New(collectors ...Collector) *Core {
	return &Core{collectors: collectors}
}

/*
Amass collects data from all collectors.
You would wonder why it's not called Collect.
Its because Collect is a method of the Collector interface.
And "Amass" is a synonym for "collect" (and is much cooler).
*/
func (c *Core) Amass(ctx context.Context) ([]error) {
	errors := make([]error, 0)
	for _, collector := range c.collectors {
		errs := collector.Collect(ctx)
		errors = append(errors, errs...)
	}

	return errors
}
