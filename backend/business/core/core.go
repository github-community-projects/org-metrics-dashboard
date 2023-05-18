package core

import (
	"context"
)

type Collector interface {
	Collect(ctx context.Context) ([]string, []error)
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
func (c *Core) Amass(ctx context.Context) ([]string, []error) {
	results, errors := make([]string, len(c.collectors)), make([]error, len(c.collectors))
	for _, collector := range c.collectors {
		r, errs := collector.Collect(ctx)
		results = append(results, r...)
		errors = append(errors, errs...)
	}

	return results, errors
}
