package com.UberDragons.project.uber.UberApp.repositories;

import com.UberDragons.project.uber.UberApp.entities.Driver;
import com.UberDragons.project.uber.UberApp.entities.Ride;
import com.UberDragons.project.uber.UberApp.entities.Rider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    Page<Ride> findByRider(Rider rider, PageRequest pageRequest);

    Page<Ride> findByDriver(Driver driver, Pageable pageRequest);
}
